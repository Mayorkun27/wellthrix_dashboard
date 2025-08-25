import React, { useState } from 'react'
import GenealogyTree from './network/GenealogyTree';
import DirectRefsTable from './network/DirectRefsTable';

const Network = () => {
    const [selectedTab, setSelectedTab] = useState("tree")

    return (
        <div className='space-y-8'>
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setSelectedTab('tree')}
                    className={`px-4 md:py-2 py-4 font-semibold rounded-lg md:text-base text-sm ${
                        selectedTab === 'tree' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Genealogy Tree
                </button>
                <button
                    onClick={() => setSelectedTab('direct')}
                    className={`px-4 md:py-2 py-4 font-semibold rounded-lg md:text-base text-sm ${
                        selectedTab === 'direct' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Referral List
                </button>
            </div>
            {selectedTab === "tree" && <GenealogyTree />}
            {selectedTab === "direct" && <DirectRefsTable />}
        </div>
    )
}

export default Network