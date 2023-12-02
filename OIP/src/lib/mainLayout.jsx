export function MainLayout(props) {
  return (
    <div className="flex flex-col md:flex-row mt-2 gap-4">
    	{props.children}

    </div>	
  );
}
