import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const SidePanel = ({ open, onClose, children }: SidePanelProps) => {
  const { t } = useTranslation();

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="w-screen max-w-xl bg-white shadow-xl p-6 relative h-full overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
                onClick={onClose}
                aria-label={t('common.Close')}
              >
                ×
              </button>
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidePanel;
