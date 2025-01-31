// app/dashboard/admin/report/components/Button.tsx
const Button = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  