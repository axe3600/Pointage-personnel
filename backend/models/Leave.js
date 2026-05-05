import mongoose from "mongoose"

const leaveSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,

    type: {
      type: String,
      default: "Congé"
    },

    startDate: String,
    endDate: String,

    reason: String,

    status: {
      type: String,
      default: "En attente"
    },

    date: {
      type: String // date de demande
    }
  },
  { timestamps: true }
)

export default mongoose.model("Leave", leaveSchema)