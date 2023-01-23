export default function SubscriptionSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-20 text-center">
      <h1 className="text-4xl font-bold">Thank you!</h1>
      <p className="mt-3 text-2xl font-medium">
        Your subscription has been activated.
      </p>
      <p className="mt-3 text-2xl font-medium">
        You will be charged on the 1st of every month.
      </p>
      <p className="mt-3 text-2xl font-medium">
        You can cancel your subscription at any time.
      </p>
    </div>
  );
}
