'use client';

import { Patient } from '@/types/types';
import { deletePatient } from '@/utils/deletePatient';
import { fetchPatients } from '@/utils/fetchPatients';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AddPatientDrawer from './AddPatientDrawer';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import DeleteModal from '@/components/DeleteModal';
import Button from '../Button';
import { UserPlusIcon } from '@heroicons/react/24/solid';

// Updated Patients Component
export default function Patients() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

    const { data: patients } = useQuery<Patient[]>({
        queryKey: ['participants'],
        queryFn: () => fetchPatients(session?.accessToken || ''),
        enabled: !!session?.accessToken,
    });

    const handleRemovePatient = async (patientId: string) => {
        try {
            await deletePatient(patientId, session?.accessToken || '');
            toast.success('Patient erfolgreich entfernt');
            queryClient.invalidateQueries({ queryKey: ['participants'] });
        } catch (error: any) {
            toast.error(`Patient konnte nicht entfernt werden: ${error.message}`);
        }
    };

    const handleCardClick = (externalId: string) => {
        router.push(`/p/${externalId}`);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPatientToDelete(null);
    };

    const confirmDelete = () => {
        if (patientToDelete) {
            handleRemovePatient(patientToDelete.externalId);
        }
        closeModal();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Patientenübersicht</h1>
                <Button icon={<UserPlusIcon className="h-6 w-6 mr-2" />} onClick={() => setDrawerOpen(true)}>
                    Patient hinzufügen
                </Button>
            </div>
            <hr className="border-gray-300 -mx-8" />

            {patients?.length === 0 && (
                <div className="text-center mt-12">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Kein Patient hinzugefügt</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Bitte fügen Sie einen Patienten hinzu, um fortzufahren.
                    </p>
                </div>
            )}

            <ul role="list" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3">
                {patients?.map((person) => (
                    <li
                        key={person.externalId}
                        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleCardClick(person.externalId)}
                    >
                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-xl font-medium text-gray-900">
                                        {person.profile.firstName} {person.profile.lastName}
                                    </h3>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>
                                        Geschlecht:{' '}
                                        <span className="font-medium text-gray-700">
                                            {person.demographics.gender === 'F' ? 'Weiblich' : 'Männlich'}
                                        </span>
                                    </p>
                                    <p>
                                        Alter:{' '}
                                        <span className="font-medium text-gray-700">{person.demographics.age}</span>
                                    </p>
                                </div>
                            </div>
                            <TrashIcon
                                className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0 hover:scale-110 transition-transform"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPatientToDelete(person);
                                    setIsModalOpen(true);
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <AddPatientDrawer open={drawerOpen} setOpen={setDrawerOpen} />
            {isModalOpen && <DeleteModal isOpen={isModalOpen} closeModal={closeModal} onConfirm={confirmDelete} />}
        </>
    );
}
