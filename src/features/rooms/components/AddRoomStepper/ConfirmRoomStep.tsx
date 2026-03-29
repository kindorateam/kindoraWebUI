import { Avatar } from "@heroui/react";
import { useFormContext } from "react-hook-form";

import { formatAgeLabel } from "../../constants";

import type { AddRoomFormData } from "../../types";

const ConfirmRoomStep = () => {
  const { watch } = useFormContext<AddRoomFormData>();
  const formData = watch();

  const isGradient = formData.avatarPreview?.startsWith("linear-gradient");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-medium text-foreground text-xl">
        Confirm Room Details
      </h2>
      <div className="flex justify-center">
        {isGradient ? (
          <div
            className="size-14 rounded-full"
            style={{ background: formData.avatarPreview }}
          />
        ) : (
          <Avatar className="size-14 text-lg">
            <Avatar.Image
              src={formData.avatarPreview ?? undefined}
              alt={formData.name}
            />
            <Avatar.Fallback>{formData.name?.charAt(0) ?? "R"}</Avatar.Fallback>
          </Avatar>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <p className="text-muted text-sm">Name</p>
          <p className="font-medium text-foreground">{formData.name}</p>
        </div>
        <div>
          <p className="text-muted text-sm">Age Range</p>
          <p className="font-medium text-foreground">
            {formatAgeLabel(formData.minAge)} –{" "}
            {formatAgeLabel(formData.maxAge)}
          </p>
        </div>
        <div>
          <p className="text-muted text-sm">Capacity</p>
          <p className="font-medium text-foreground">{formData.capacity}</p>
        </div>
        <div>
          <p className="text-muted text-sm">Ratio</p>
          <p className="font-medium text-foreground">{formData.ratio}:1</p>
        </div>
        <div>
          <p className="text-muted text-sm">Staff</p>
          <p className="font-medium text-foreground">
            {formData.staffIds?.length || 0} selected
          </p>
        </div>
        <div>
          <p className="text-muted text-sm">Students</p>
          <p className="font-medium text-foreground">
            {formData.studentIds?.length || 0} selected
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRoomStep;
