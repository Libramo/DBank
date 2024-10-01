"use server";

import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { log } from "console";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    //   cookies().set("appwrite-session", session.secret, {
    //     path: "/",
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: true,
    //   });
    //   const user = await getUserInfo({ userId: session.userId })
    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;

  // let newUserAccount;

  try {
    // console.log(firstName);
    const { account, database } = await createAdminClient();
    // console.log(account);

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // console.log(newUserAccount);

    //   if(!newUserAccount) throw new Error('Error creating user')
    //   const dwollaCustomerUrl = await createDwollaCustomer({
    //     ...userData,
    //     type: 'personal'
    //   })
    //   if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
    //   const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    //   const newUser = await database.createDocument(
    //     DATABASE_ID!,
    //     USER_COLLECTION_ID!,
    //     ID.unique(),
    //     {
    //       ...userData,
    //       userId: newUserAccount.$id,
    //       dwollaCustomerId,
    //       dwollaCustomerUrl
    //     }
    //   )
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("Error", error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
