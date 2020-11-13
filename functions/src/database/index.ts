import { rolesRef } from ".."
import { RoleCode } from "./model/Role";


//Code to automatically populate the role subcollection

export const populateRole  = async ()=>{
    const snap = await rolesRef.get();
    if(snap.size != 0) return;
    const roles = Object.values(RoleCode);
    const now = new Date();
    roles.forEach(async (roleCode)=>{
        await rolesRef.doc(roleCode).set({
            code:roleCode,
            status:true,
            createdAt:now,
            updatedAt:now
        })
    })

}