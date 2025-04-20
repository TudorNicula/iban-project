import NavBar from './NavBar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
       return (
         <div
           className="
             min-h-screen flex flex-col
             bg-gray-50 text-gray-900
             dark:bg-gray-900 dark:text-gray-100
           "
         >
           <NavBar />
           <main className="flex-1 p-4">{children}</main>
         </div>
       );
     };

export default AppLayout;
