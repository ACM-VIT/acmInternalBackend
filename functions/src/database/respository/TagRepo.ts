import { tagsRef } from "../..";
import Tag from "../model/Tag";


export default class TagRepo {
    public static async create(tag: Tag): Promise<any> {
        const createdTagRef = await tagsRef.doc();
        await createdTagRef.set(tag, { merge: true });
        const newTag = await (await createdTagRef.get()).data();
        return { ...newTag, id: createdTagRef.id };
    }

    public static async fetchAll(): Promise<Tag[] | undefined> {
        const allTags = await tagsRef.get();
        if (allTags.empty) return undefined;
        const res: any = [];
        allTags.forEach((doc) =>
            res.push({
                id: doc.id,
                ...doc.data(),
            })
        );
        return res;
    }

    public static async findByName(
        name: string
    ): Promise<Tag | undefined> {
        const snapshot = await tagsRef.where("name", "==", name).get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }
}