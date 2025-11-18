import React from 'react';
import { LaunchToken } from '../../../entities/token/api/tokenApi';
import { DataTable, columns } from './DataTable';

interface TokenTableProps {
  tokens: LaunchToken[];
  loading: boolean;
}


export const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  return <DataTable columns={columns} data={tokens} />;
};
