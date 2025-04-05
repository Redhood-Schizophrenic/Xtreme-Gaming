'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { useLocation } from 'react-router';

export default function Search() {
	const { onClick } = () => { };
	const pathname = useLocation().pathname;
	const title = pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase());
	const [searchValue, setSearchValue] = useState('');

	// Static data
	const dataList = [
		{ id: 1, customer_name: 'Test1', customer_contact: '123-456-7890' },
		{ id: 2, customer_name: 'Test2', customer_contact: '234-567-8901' },
		{ id: 3, customer_name: 'Test3', customer_contact: '345-678-9012' },
		{ id: 4, customer_name: 'John Doe', customer_contact: '456-789-0123' },
		{ id: 5, customer_name: 'Jane Smith', customer_contact: '567-890-1234' }
	];

	// Handle input change
	const handleChange = (e) => {
		setSearchValue(e.target.value);
	};

	// Handle selection from datalist
	const handleSelect = (e) => {
		const selected = dataList.find(item => item.customer_name === e.target.value);
		if (selected && onClick) {
			onClick(selected);
		}
	};

	if (title === 'Bookings') {
		return (
			<form className='flex items-center w-full relative'>
				<label htmlFor="Search" className="sr-only">Search</label>
				<Input
					type="text"
					id="Search"
					list="data"
					placeholder="Search ..."
					value={searchValue}
					onChange={handleChange}
					onBlur={handleSelect}
				/>
				<datalist id="data">
					{dataList.map(customer => (
						<option
							key={customer.id}
							value={customer.customer_name}
							data-contact={customer.customer_contact}
						>
							{customer.customer_name} - {customer.customer_contact}
						</option>
					))}
				</datalist>
			</form>
		);
	} else {
		return "";

	}

}
