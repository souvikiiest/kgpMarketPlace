import SigninForm from "../components/Signin";

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          Log In to Your Account
        </h2>
        <SigninForm />
      </div>
    </div>
  );
}
