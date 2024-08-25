import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Select from "react-select";
import Footer from "./components/footer";

const App = () => {
	const [jsonInput, setJsonInput] = useState("");
	const [response, setResponse] = useState(null);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleJsonInputChange = (e) => {
		setJsonInput(e.target.value);
	};

	const handleSubmit = async () => {
		if (!jsonInput) {
			toast.error("Please enter a valid JSON input.");
			return;
		}
		try {
			setLoading(true);
			const parsedJson = JSON.parse(jsonInput);
			if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
				toast.error("Invalid JSON format.");
				throw new Error("Invalid JSON format.");
			}

			const res = await axios.post("https://testbfhl-8uqa.onrender.com/bfhl", parsedJson);
			setResponse(res.data);
			setDropdownVisible(true);
		} catch (err) {
			console.log(err.response ? err.response.data : err.message);
			toast.error(err.response ? err.response.data : "Invalid JSON format.");
		} finally {
			setLoading(false);
		}
	};

	const handleDropdownChange = (selected) => {
		const values = selected.map((option) => option.value);
		setSelectedOptions(values);
	};

	const options = [
		{ value: "Alphabets", label: "Alphabets" },
		{ value: "Numbers", label: "Numbers" },
		{
			value: "Highest lowercase alphabet",
			label: "Highest lowercase alphabet",
		},
	];

	const renderResponse = () => {
		if (!response) return null;

		return (
			<>
				<h2 className='text-lg text-slate-700 font-semibold mt-6 text-left'>
					Response: (choose a filter to see the response)
				</h2>
				<div className='mt-6 p-4 bg-gray-100 rounded-lg shadow-md max-w-md w-full'>
					{selectedOptions.includes("Alphabets") && (
						<div className='mb-2'>
							<strong>Alphabets:</strong> {JSON.stringify(response.alphabets)}
						</div>
					)}
					{selectedOptions.includes("Numbers") && (
						<div className='mb-2'>
							<strong>Numbers:</strong> {JSON.stringify(response.numbers)}
						</div>
					)}
					{selectedOptions.includes("Highest lowercase alphabet") && (
						<div className='mb-2'>
							<strong>Highest lowercase alphabet:</strong>{" "}
							{JSON.stringify(response.highest_lowercase_alphabet)}
						</div>
					)}
				</div>
			</>
		);
	};

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
			<h1 className='text-2xl font-bold mb-6'>JSON Input Form (BFHL Task)</h1>
			<div className='w-full max-w-md flex flex-col gap-4'>
				<input
					value={jsonInput}
					onChange={handleJsonInputChange}
					placeholder='Enter JSON here...'
					className='w-full p-3 border border-gray-300 rounded'
				/>
				<button
					onClick={handleSubmit}
					className='px-4 py-2 bg-red-500 text-white rounded'>
					Submit
				</button>
			</div>

			{dropdownVisible && (
				<div className='mt-4 w-full max-w-md'>
					<label className='block text-gray-700 mb-2 text-lg font-semibold'>
						Select options:
					</label>
					<Select options={options} onChange={handleDropdownChange} isMulti />
				</div>
			)}

			{loading && (
				<div className='mt-6'>
					<p className='text-lg text-slate-700 font-semibold'>
						fetching response...
					</p>
				</div>
			)}

			{renderResponse()}

			<Footer />
		</div>
	);
};

export default App;
