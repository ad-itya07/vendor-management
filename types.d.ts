// types.d.ts (or at the top of your db.ts/dbConnect.ts file)
export {};

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
