import { sortCriteria } from '@/constants/sortCriteria';
import { useCounterStore } from '@/providers/useStoreProvider';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function NutrientDropdown({
    selectedOption,
    setSelectedOption,
}: {
    selectedOption: string;
    setSelectedOption: (option: string) => void;
}) {
    const { setSelectedSortCriteria } = useCounterStore((state) => state);

    const handleSelection = (option: string, close: () => void) => {
        setSelectedOption(option);
        setSelectedSortCriteria(option);
        close();
    };

    return (
        <Popover className="relative inline-block text-left block w-full min-w-0 flex-1 rounded-md text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
            <div>
                <PopoverButton className="items-center justify-between inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary">
                    {selectedOption}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </PopoverButton>
            </div>

            <PopoverPanel className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                {({ close }) => (
                    <div className="py-1">
                        {sortCriteria.map((nutrient) => (
                            <button
                                key={nutrient}
                                onClick={() => handleSelection(nutrient, close)}
                                className={`group flex w-full items-center px-4 py-2 text-sm ${
                                    selectedOption === nutrient ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                }`}
                            >
                                {nutrient}
                            </button>
                        ))}
                    </div>
                )}
            </PopoverPanel>
        </Popover>
    );
}
