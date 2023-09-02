interface User {
    email: string | null;
    name: string | null;
    username: string | null;
    birthYear: number | null;
    role: 'user' | 'editor' | 'admin' | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isOnboarded: boolean | null;
}

export default User;
