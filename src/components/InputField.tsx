type Props = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
};

export default function InputField({
  placeholder,
  value,
  onChange,
  type,
  id,
}: Props) {
  return (
    <>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border
         border-gray-300 rounded-md 
         focus:outline-none focus:ring-2
          focus:ring-blue-500 
          focus:border-transparent
          text-gray-800
          placeholder-gray-400"
        placeholder={placeholder}
        required
      />
    </>
  );
}
