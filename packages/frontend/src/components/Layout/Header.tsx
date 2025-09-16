import ConnectButton from "@/components/Web3/ConnectButton";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">デジタル人格</h1>
        <ConnectButton />
      </div>
    </header>
  );
}
