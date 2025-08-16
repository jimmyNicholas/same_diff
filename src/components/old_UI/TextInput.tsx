interface TextInputProps {
  placeholder?: string;
}

const TextInput = ({ placeholder }: TextInputProps) => {
  return <input type="text" className="input input-bordered" placeholder={placeholder} />;
};

export default TextInput;