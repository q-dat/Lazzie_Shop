import mongoose, { Schema, Document } from 'mongoose';

export interface IWalletCatalog extends Document {
  name: string;
}

const WalletCatalogSchema = new Schema<IWalletCatalog>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.WalletCatalog || mongoose.model<IWalletCatalog>('WalletCatalog', WalletCatalogSchema);
