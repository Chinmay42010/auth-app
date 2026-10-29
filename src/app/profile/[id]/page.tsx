import Link from "next/link";
import { Suspense } from "react";

const UserProfileContent = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Profile</h1>
                <p className="text-gray-600 text-center mb-6">Profile Page</p>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center">
                    <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        {id}
                    </span>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/profile"
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium hover:underline"
                    >
                        back to profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default async function UserProfile({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback="Loading profile...">
            <UserProfileContent params={params} />
        </Suspense>
    );
}
