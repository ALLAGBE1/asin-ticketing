import toast from 'react-hot-toast';

const notificationSuccessStyle = {
  'background-color': '#00ac00',
  color: '#fff',
  'font-weight': '700',
  'border-bottom': '4px solid',
  'min-width': '24rem',
};

const notificationErrorStyle = {
  'background-color': '#ff4040',
  color: '#fff',
  'font-weight': '700',
  'border-bottom': '4px solid',
  'min-width': '24rem',
};

// export function notificationToast(text: string, duration?=4000, type:string, icon?:string, style?:any)  {
//     return `${API_URL}/api/v1/upload_file/${uploadId}`;
// }

export function notificationSuccessToast(text: string, duration = 4000) {
  toast.success(text, {
    duration: duration,
    style: notificationSuccessStyle,
  });
}

export function notificationErrorToast(text: string, duration = 4000) {
  toast.error(text, {
    duration: duration,
    style: notificationErrorStyle,
  });
}

// export function notificationErrorToast(text: string, duration=4000, style?:any)  {
//     toast.custom((t) => (
//         `
//         <div
//         className={`${
//           t.visible ? 'animate-enter' : 'animate-leave'
//         } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//       >
//         <div className="flex-1 w-0 p-4">
//           <div className="flex items-start">
//             <div className="flex-shrink-0 pt-0.5">
//               <img
//                 className="h-10 w-10 rounded-full"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//                 alt=""
//               />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm font-medium text-gray-900">
//                 Emilia Gates
//               </p>
//               <p className="mt-1 text-sm text-gray-500">
//                 Sure! 8:30pm works great!
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex border-l border-gray-200">
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//         `
//       ))
// }
