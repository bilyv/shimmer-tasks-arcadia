import { Layout } from "@/components/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mt-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">Your profile information</p>
      </div>
    </Layout>
  );
};

export default Profile; 