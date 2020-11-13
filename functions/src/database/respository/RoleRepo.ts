import { rolesRef } from "../..";
import Role from "../model/Role";


export default class RoleRepo {
    public static async findByCode(code:string):Promise<Role[] | undefined> {
            const snapshot = await rolesRef.where("code", "==", code).where("status","==",true).get();
            if (snapshot.empty) return undefined;
            const res: any = [];
            snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
            return res;
    }
}