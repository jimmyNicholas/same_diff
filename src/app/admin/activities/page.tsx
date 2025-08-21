"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Picture from "@/components/ui/picture";
import { Textarea } from "@/components/ui/textarea";

const AdminActivities = () => {
  const handleGetImage = () => {
    console.log("get image called");
  };

  return (
    <div>
      <div className="grid grid-flow-row gap-2 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 border-2 border-gray-200 rounded-lg mt-4">
        {/* Vocab Box */}
        <Label className="text-lg font-bold">Vocabulary</Label>
        <Textarea
          className="h-30 mt-2"
          placeholder="Enter vocabulary here seperated by commas..."
        />

        {/* Vocab Row */}
        <div className="grid grid-cols-7 gap-2 mt-2 border-2 border-gray-200 rounded-lg p-2 items-center">
          <Input
            className="col-span-2"
            placeholder="Enter vocabulary here seperated by commas..."
          />
          {/* Picture Box */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="col-span-1 flex items-center justify-center p-2" key={index}>
              <Button className="h-25 w-25" onClick={handleGetImage}>
                <span className="text-4xl">+</span>
              </Button>
            </div>
          ))}
          {/* <div className="col-span-1">
            <Button>+</Button>
          </div>
          <Picture src="/images/picture.png" alt="Picture" size="sm"/>
          <Picture src="/images/picture.png" alt="Picture" size="sm"/>
          <Picture src="/images/picture.png" alt="Picture" size="sm"/>
          <Picture src="/images/picture.png" alt="Picture" size="sm"/>
          <Picture src="/images/picture.png" alt="Picture" size="sm"/> */}
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;
