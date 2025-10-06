export class ServiceError extends Error {
    public original?: any;
    constructor(message: string, original?: any) {
        super(message);
        this.name = "ServiceError";
        this.original = original;
    }
}

export function wrapError(context: string, error: unknown) {
    console.error(`${context}:`, error);
    return new ServiceError(context, error);
}

export async function selectMaybeSingle<T = any>(query: any): Promise<T | null> {
    const { data, error } = await query;

        if (error) throw wrapError("Database select error", error);

    return data ?? null;
}

export async function select<T = any>(query: any): Promise<T[]> {
    const { data, error } = await query;

    if (error) throw wrapError("Database select error", error);

    return data ?? [];
}

export async function insertSingle<T = any>(query: any): Promise<T> {
    const { data, error } = await query.select().maybeSingle();

    if (error) throw wrapError("Database insert error", error);
    if (!data) throw new ServiceError("Insert returned no data");

    return data as T;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}