import mongoose, { Schema, Document } from 'mongoose';

export interface WalletFormData {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: string;
  status: string;
  image: FileList;
  thumbnail: FileList;
}

export interface IWallet {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: string;
  status: string;
  image: string;
  thumbnail: string;
}

export interface IWalletDocument extends Document {
  _id: mongoose.Types.ObjectId;
  wallet_catalog_id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: string;
  status: string;
  image: string;
  thumbnail: string;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    wallet_catalog_id: { type: Schema.Types.ObjectId, ref: 'WalletCatalog', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    size: { type: String },
    quantity: { type: String },
    status: { type: String },
    image: { type: String, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model<IWalletDocument>('Wallet', WalletSchema);
