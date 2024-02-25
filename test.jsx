function TestComponent() {
    return <div hover="bg-blue-500"
                className="w-full p-3"
                sm="bg-red-500"
                lg="p-10 flex-col"
                first-of-type="bg-green-500"
                onClick={(e)=>{console.log(e);}}
                md="flex flex-row">Hover me</div>;
  }
  