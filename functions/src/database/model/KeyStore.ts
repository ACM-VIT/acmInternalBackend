


export default interface Keystore {
    id?:string,
    client: string;
    primaryKey: string;
    secondaryKey: string;
    status?: boolean;
    createdAt?: string; //iso string
    updatedAt?: string; //iso string
}


export const KEYSTORE_COLLECTION_NAME="Keystore";
  