import { Transition, Listbox } from "@headlessui/react";
import {
	CheckIcon,
	ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

const topicSelectorStyle = {
	minWidth: '150px',
};

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export interface DropdownItem
{
    id: string;
    text: string;
    hidden?: boolean;
}

interface DropdownProps
{
    label: string;
    placeholder?: string;
    value?: DropdownItem;
    items: DropdownItem[];
    onSelect: (value: DropdownItem) => void;
}

function Dropdown({ label, placeholder = '', value, items, onSelect } : DropdownProps)
{
    return (
        <span>
            <Listbox
                value={value || {}}
                onChange={onSelect}
            >
                {({ open }) => (
                    <>
                        <Listbox.Label className="sr-only">
                            {label}
                        </Listbox.Label>
                        <div className="relative">
                            <Listbox.Button className="flex relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm items-center">
                                <span className="block truncate grow text-black" style={topicSelectorStyle}>
                                    {value?.text ?? placeholder}
                                </span>
                                <span className="pointer-events-none inset-y-0 right-0 flex items-center pl-1">
                                    <ChevronDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-64 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {items.filter(el => !el?.hidden).map(
                                        (item) => (
                                            <Listbox.Option
                                                key={
                                                    item.id
                                                }
                                                className={({
                                                    active,
                                                }) =>
                                                    classNames(
                                                        active
                                                            ? "text-white bg-indigo-600"
                                                            : "text-gray-900",
                                                        "relative cursor-default select-none py-2 pl-8 pr-4"
                                                    )
                                                }
                                                value={item}
                                            >
                                                {({
                                                    selected,
                                                    active,
                                                }) => (
                                                    <>
                                                        <span
                                                            className={classNames(
                                                                selected
                                                                    ? "font-semibold"
                                                                    : "font-normal",
                                                                "block truncate"
                                                            )}
                                                        >
                                                            {
                                                                item.text
                                                            }
                                                        </span>

                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                    active
                                                                        ? "text-white"
                                                                        : "text-indigo-600",
                                                                    "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                                                )}
                                                            >
                                                                <CheckIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        )
                                    )}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </span>
    );
}

export default Dropdown;
