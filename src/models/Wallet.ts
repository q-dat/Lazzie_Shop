import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  wallet_catalog_id: mongoose.Types.ObjectId;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  thumbnail: string;
}

const WalletSchema = new Schema<IWallet>(
  {
    wallet_catalog_id: { type: Schema.Types.ObjectId, ref: 'WalletCatalog', required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
