import React, { memo } from "react";
import appleIdAvatar from "@/assets/images/logo/logo_butterfly.png";

export const AppleIdAvatar = memo(() => (
  <div className="apple-id-avatar">
    <img src={appleIdAvatar} alt="Apple ID Avatar" loading="lazy" />
  </div>
));
