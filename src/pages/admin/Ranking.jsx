import React, { useState } from "react";
import Unilevel from "./ranks/Unilevel";
import RankAchievement from "./ranks/RankAchievement";
import Leadership from "./ranks/Leadership";

const Ranking = () => {
  const [selectedType, setSelectedType] = useState("Unilevel");

  return (
    <div className="space-y-6">
      {/* Selection Dropdown */}
      <div className="flex items-center gap-4 justify-end">
        <select
          id="rankType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-tranparent text-sm text-black/80 px-4 py-2 rounded-full outline-none  border border-pryClr/80 cursor-pointer"
          
        >
          <option value="Unilevel">Unilevel</option>
          <option value="Rank Achievement">Rank Achievement</option>
          {/* <option value="Leadership">Leadership</option> */}
        </select>
      </div>

      {/* Display Selected Component */}
      {selectedType === "Unilevel" && <Unilevel />}
      {selectedType === "Rank Achievement" && <RankAchievement />}
      {/* {selectedType === "Leadership" && <Leadership />} */}
    </div>
  );
};

export default Ranking;
