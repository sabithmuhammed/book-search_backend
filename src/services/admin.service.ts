import { AdminDocument, AdminModel } from "../models/admin.model";

export class AdminService {
    async findByEmail(email: string): Promise<AdminDocument | null> {
        const admin = await AdminModel.findOne({ email });
        return admin;
    }
}
