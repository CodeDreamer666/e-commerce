import bcrypt from "bcryptjs";

export default async function hashing(string: string) {
    return bcrypt.hash(string, 10)
} 
