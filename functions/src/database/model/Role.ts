
export enum RoleCode {
   CORE_MEMBER="core_member",
   BOARD_MEMBER="board_member",
}

export default interface Role {
   code:string,
   status:boolean,
   createdAt?:string,
   updatedAt?:string,
}


export const ROLES_COLLECTION_NAME="Roles";
  