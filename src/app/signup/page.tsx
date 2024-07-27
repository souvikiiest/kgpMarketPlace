import SignupForm from "../components/Signup";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <SignupForm />
      </div>
    </div>
  );
}
