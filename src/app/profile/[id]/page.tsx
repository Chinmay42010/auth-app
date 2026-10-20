export default async function UserProfile({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <br />
            <p className="text-3xl">
                Profile Page <span className="bg-orange-500 rounded-sm px-1 text-black">{id}</span>
            </p>
        </div>
    );
}

