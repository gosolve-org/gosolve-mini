interface AuthUser {
    uid: string;
    email: string;
    displayName: string | null;
    name: string | null;
    username: string | null;
    birthYear: number | null;
    photoURL: string | null;
    isOnboarded: boolean;
}

export default AuthUser;
