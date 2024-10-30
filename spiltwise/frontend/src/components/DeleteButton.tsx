import React from 'react';
import axios from 'axios';
interface DeleteButtonProps {
    token: string;
    expenseId: string;
    onDeleteSuccess: () => void;
    onDeleteFailure: (error: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ token, expenseId, onDeleteSuccess, onDeleteFailure }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.post('http://localhost:8787/api/v1/deleteexpense', 
    { expenseId }, 
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
);

const data = response.data;

            if (response.status === 200) {
                onDeleteSuccess();
            } else {
                onDeleteFailure(data.msg || 'Failed to delete expense');
            }
        } catch (error) {
            onDeleteFailure('An error occurred while deleting the expense');
        }
    };

    return (
        <button
            onClick={handleDelete}
            style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ff1a1a')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4d4d')}
        >
            Delete Expense
        </button>
    );
};

export default DeleteButton;
