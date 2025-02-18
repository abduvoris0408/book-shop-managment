import { useEffect, useState } from 'react'
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'

const App = () => {
	const [books, setBooks] = useState(() => {
		const savedBooks = localStorage.getItem('books')
		return savedBooks
			? JSON.parse(savedBooks)
			: [
					{
						id: 1,
						title: 'The Great Gatsby',
						author: 'F. Scott Fitzgerald',
						price: 19.99,
						genre: 'Classic',
						isbn: '978-0743273565',
						year: 1925,
						description: 'A story of decadence and excess.',
						image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
					},
					{
						id: 2,
						title: 'To Kill a Mockingbird',
						author: 'Harper Lee',
						price: 24.99,
						genre: 'Fiction',
						isbn: '978-0446310789',
						year: 1960,
						description: 'A classic of modern American literature.',
						image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
					},
			  ]
	})

	const [searchTerm, setSearchTerm] = useState('')
	const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
	const [sortBy, setSortBy] = useState('title')
	const [showModal, setShowModal] = useState(false)
	const [modalType, setModalType] = useState(null)
	const [selectedBook, setSelectedBook] = useState(null)
	const [formData, setFormData] = useState({
		title: '',
		author: '',
		price: '',
		genre: '',
		isbn: '',
		year: '',
		description: '',
		image: '',
	})

	useEffect(() => {
		localStorage.setItem('books', JSON.stringify(books))
	}, [books])

	const handleSearch = e => {
		setSearchTerm(e.target.value)
	}

	const filteredBooks = books
		.filter(book => {
			const matchesSearch =
				book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
				book.genre.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesPrice =
				book.price >= priceRange.min && book.price <= priceRange.max
			return matchesSearch && matchesPrice
		})
		.sort((a, b) => {
			if (sortBy === 'price') return a.price - b.price
			return a[sortBy].localeCompare(b[sortBy])
		})

	const handleSubmit = e => {
		e.preventDefault()
		if (modalType === 'add') {
			setBooks([...books, { ...formData, id: Date.now() }])
		} else if (modalType === 'edit' && selectedBook) {
			setBooks(
				books.map(book =>
					book.id === selectedBook.id
						? { ...formData, id: book.id }
						: book
				)
			)
		}
		setShowModal(false)
		setFormData({
			title: '',
			author: '',
			price: '',
			genre: '',
			isbn: '',
			year: '',
			description: '',
			image: '',
		})
	}

	const handleDelete = id => {
		if (window.confirm('Are you sure you want to delete this book?')) {
			setBooks(books.filter(book => book.id !== id))
		}
	}

	return (
		<div className='h-auto'>
			<div className='bg-gray-50 text-gray-900 p-6'>
				<div className='max-w-7xl mx-auto'>
					<header className='flex justify-between items-center mb-8'>
						<h1 className='text-xl font-bold'>
							Book Shop Management
						</h1>
					</header>

					<div className='flex flex-col md:flex-row justify-between gap-4 mb-6'>
						<div className='flex-1'>
							<div className='relative'>
								<FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
								<input
									type='text'
									placeholder='Search books...'
									value={searchTerm}
									onChange={handleSearch}
									className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white'
								/>
							</div>
						</div>

						<div className='flex gap-4'>
							<select
								value={sortBy}
								onChange={e => setSortBy(e.target.value)}
								className='px-4 py-2 rounded-lg border border-gray-300 bg-white'
							>
								<option value='title'>Sort by Title</option>
								<option value='price'>Sort by Price</option>
								<option value='author'>Sort by Author</option>
							</select>

							<button
								onClick={() => {
									setModalType('add')
									setShowModal(true)
								}}
								className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90'
							>
								<FiPlus /> Add Book
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{filteredBooks.map(book => (
							<div
								key={book.id}
								className='bg-white rounded-lg shadow-sm overflow-hidden'
							>
								<img
									src={book.image}
									alt={book.title}
									className='w-full h-48 object-cover'
									onError={e => {
										e.target.src =
											'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
									}}
								/>
								<div className='p-4'>
									<h3 className='font-bold text-lg mb-2'>
										{book.title}
									</h3>
									<p className='text-gray-500 mb-2'>
										{book.author}
									</p>
									<p className='text-blue-500 font-bold mb-2'>
										${book.price}
									</p>
									<p className='text-sm text-gray-500 mb-4'>
										{book.genre}
									</p>
									<div className='flex justify-end gap-2'>
										<button
											onClick={() => {
												setSelectedBook(book)
												setFormData(book)
												setModalType('edit')
												setShowModal(true)
											}}
											className='p-2 text-gray-500 hover:text-blue-500'
										>
											<FiEdit />
										</button>
										<button
											onClick={() =>
												handleDelete(book.id)
											}
											className='p-2 text-gray-500 hover:text-red-500'
										>
											<FiTrash2 />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{showModal && (
						<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
							<div className='bg-white rounded-lg p-6 w-full max-w-md'>
								<h2 className='text-xl font-bold mb-4'>
									{modalType === 'add'
										? 'Add New Book'
										: 'Edit Book'}
								</h2>
								<form
									onSubmit={handleSubmit}
									className='space-y-4'
								>
									<input
										type='text'
										placeholder='Title'
										required
										value={formData.title}
										onChange={e =>
											setFormData({
												...formData,
												title: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<input
										type='text'
										placeholder='Author'
										required
										value={formData.author}
										onChange={e =>
											setFormData({
												...formData,
												author: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<input
										type='number'
										placeholder='Price'
										required
										value={formData.price}
										onChange={e =>
											setFormData({
												...formData,
												price: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<select
										required
										value={formData.genre}
										onChange={e =>
											setFormData({
												...formData,
												genre: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									>
										<option value=''>Select Genre</option>
										<option value='Fiction'>Fiction</option>
										<option value='Non-Fiction'>
											Non-Fiction
										</option>
										<option value='Classic'>Classic</option>
										<option value='Science'>Science</option>
									</select>
									<input
										type='text'
										placeholder='ISBN'
										value={formData.isbn}
										onChange={e =>
											setFormData({
												...formData,
												isbn: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<input
										type='number'
										placeholder='Publication Year'
										value={formData.year}
										onChange={e =>
											setFormData({
												...formData,
												year: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<textarea
										placeholder='Description'
										value={formData.description}
										onChange={e =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<input
										type='url'
										placeholder='Image URL'
										value={formData.image}
										onChange={e =>
											setFormData({
												...formData,
												image: e.target.value,
											})
										}
										className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white'
									/>
									<div className='flex justify-end gap-4'>
										<button
											type='button'
											onClick={() => setShowModal(false)}
											className='px-4 py-2 text-gray-500 hover:text-red-500'
										>
											Cancel
										</button>
										<button
											type='submit'
											className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90'
										>
											{modalType === 'add'
												? 'Add Book'
												: 'Save Changes'}
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
