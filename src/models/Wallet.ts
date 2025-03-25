import mongoose, { Schema, Document } from 'mongoose';

export interface WalletFormData {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  color: string;
  quantity: string;
  price: number;
  image: FileList;
  thumbnail: FileList;
}

export interface IWallet {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  color: string;
  quantity: string;
  price: number;
  image: string;
  thumbnail: string;
}

export interface Wallet extends Document {
  _id: string;
  wallet_catalog_id: mongoose.Types.ObjectId;
  name: string;
  color: string;
  quantity: string;
  price: number;
  image: string;
  thumbnail: string;
}

const WalletSchema = new Schema<Wallet>(
  {
    wallet_catalog_id: { type: Schema.Types.ObjectId, ref: 'WalletCatalog', required: true },
    name: { type: String, required: true },
    color: { type: String },
    quantity: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model<Wallet>('Wallet', WalletSchema);
