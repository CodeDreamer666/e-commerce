import bcrypt from "bcryptjs";

export default async function compare(input: string, hash: string ) {
    return bcrypt.compare(input, hash)
} 