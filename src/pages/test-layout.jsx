import React from "react";

const TestLayout = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Layout Test Page</h1>
      <p className="text-gray-600 mb-4">
        This is a test page to verify the layout is working correctly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">Card 1</div>
        <div className="bg-green-100 p-4 rounded">Card 2</div>
        <div className="bg-purple-100 p-4 rounded">Card 3</div>
      </div>
    </div>
  );
};

export default TestLayout;
