/**
 * Creates the demo accounts through BetterAuth's own sign-up (so password hashing is correct),
 * then sets their roles directly in MongoDB (admin cannot be created through the public sign-up).
 *
 *   1) npm run seed          (client repo)  -> users
 *   2) npm run seed          (server repo)  -> services, bookings, payments
 */
import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { auth } = await import("../src/lib/auth");
  const { db, mongoClient } = await import("../src/lib/mongodb");

  const demoPw = process.env.SEED_DEMO_PASSWORD || "Demo1234";
  const adminPw = process.env.SEED_ADMIN_PASSWORD || "Admin123";

  const accounts = [
    { name: "FixMate Admin", email: process.env.SEED_ADMIN_EMAIL || "admin@fixmate.dev", password: adminPw, role: "admin", area: "Dhaka", phone: "01700000000", bio: "Platform administrator." },
    { name: "Rafiq Hasan", email: process.env.SEED_TECH1_EMAIL || "tech1@fixmate.dev", password: demoPw, role: "technician", area: "Dhanmondi, Dhaka", phone: "01711111111", bio: "Phone, laptop and fridge specialist with 8 years of bench experience." },
    { name: "Nusrat Jahan", email: process.env.SEED_TECH2_EMAIL || "tech2@fixmate.dev", password: demoPw, role: "technician", area: "Gulshan, Dhaka", phone: "01722222222", bio: "AC, TV and electrical technician. Certified, insured and punctual." },
    { name: "Tanvir Ahmed", email: process.env.SEED_CUSTOMER_EMAIL || "customer@fixmate.dev", password: demoPw, role: "customer", area: "Mirpur, Dhaka", phone: "01733333333", bio: "" },
  ];

  const users = db.collection("user");
  for (const a of accounts) {
    const existing = await users.findOne({ email: a.email });
    if (!existing) {
      await auth.api.signUpEmail({
        body: { name: a.name, email: a.email, password: a.password, role: "customer" } as any,
      });
      console.log("created", a.email);
    } else {
      console.log("exists ", a.email);
    }
    // role / profile fields written straight to the DB (admin cannot go through sign-up)
    await users.updateOne(
      { email: a.email },
      { $set: { role: a.role, area: a.area, phone: a.phone, bio: a.bio } }
    );
  }
  console.log("Done. Now run `npm run seed` in the server repo.");
  await mongoClient.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
