import express from 'express';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Fields a caller is allowed to write via the update endpoint.
// Prevents arbitrary Firestore field injection from the request body.
const ALLOWED_UPDATE_FIELDS = [
    'BUEmail', 'FirstName', 'LastName', 'GradYear', 'Colleges',
    'Major', 'Minor', 'Position', 'Clout', 'Class',
    'Eboard_Position', 'LinkedIn', 'WebsitePhotoURL', 'pictureUrl',
];

export default function usersRoute(db) {
    // Get all Users — public, used by the main website
    router.get('/', async (request, response) => {
        try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, orderBy('FirstName', 'asc'));
            const userSnapshot = await getDocs(q);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return response.status(200).json({ count: userList.length, data: userList });
        } catch (error) {
            console.error('Error fetching users:', error);
            response.status(500).send({ message: error.message });
        }
    });

    // Get a User by email — admin only (exposes PII)
    router.get('/email/:email', requireAdmin, async (request, response) => {
        try {
            const { email } = request.params;
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where('BUEmail', '==', email));
            const querySnapshot = await getDocs(q);
            const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return response.status(200).json(userList);
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    });

    // Get a User by ID
    router.get('/:id', async (request, response) => {
        try {
            const { id } = request.params;
            const userDoc = doc(db, 'users', id);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                return response.status(200).json({ id: userSnapshot.id, ...userSnapshot.data() });
            }
            return response.status(404).json({ message: 'User not found' });
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    });

    // Add a User — admin only
    router.post('/', requireAdmin, async (request, response) => {
        try {
            const { BUEmail, FirstName, LastName, GradYear, Colleges, Major, Position } = request.body;

            if (!BUEmail || !FirstName || !LastName || !GradYear || !Colleges || !Major || !Position) {
                return response.status(400).send({
                    message: 'Send all required fields: BUEmail, FirstName, LastName, GradYear, Colleges, Major, Position',
                });
            }
            if (Position > 4 || Position < 0) {
                return response.status(400).send({ message: 'Position must be an integer 0 through 4' });
            }

            const usersCollection = collection(db, 'users');
            const newUser = { BUEmail, FirstName, LastName, GradYear, Colleges, Major, Position };
            await addDoc(usersCollection, newUser);
            return response.status(200).send({ message: 'User added successfully' });
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    });

    // Update a User — admin only, with field whitelist
    router.put('/:id', requireAdmin, async (request, response) => {
        try {
            const { id } = request.params;
            const userDoc = doc(db, 'users', id);
            const userSnapshot = await getDoc(userDoc);
            if (!userSnapshot.exists()) {
                return response.status(404).json({ message: 'User not found' });
            }

            // Only write fields that are explicitly allowed — prevents arbitrary Firestore writes
            const updates = {};
            for (const field of ALLOWED_UPDATE_FIELDS) {
                if (request.body[field] !== undefined) {
                    updates[field] = request.body[field];
                }
            }

            if (Object.keys(updates).length === 0) {
                return response.status(400).json({ message: 'No valid fields to update' });
            }

            await updateDoc(userDoc, updates);
            return response.status(200).send({ message: 'User updated successfully' });
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    });

    // Delete a User — admin only
    router.delete('/:id', requireAdmin, async (request, response) => {
        try {
            const { id } = request.params;
            const userDoc = doc(db, 'users', id);
            await deleteDoc(userDoc);
            return response.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    });

    return router;
}
