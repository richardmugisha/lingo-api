import Structure from "../../../models/guru/structure.js";

const getGuru = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const structure = await Structure.findOne({ userID: id })
        if (!structure) {
            return res.status(404).json({ message: "Guru structure not found" });
        }
        return res.status(200).json(structure);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const createGuru = async (req, res) => {
    try {
        const { userID } = req.body;
        const newStructure = new Structure({
            userID,
            structure: {}
        });

        newStructure.save()
            .then(savedStructure => res.status(201).json(savedStructure))
            .catch(error => res.status(500).json({ message: "Error creating structure", error: error.message }));

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}   

const updateGuru = async (req, res) => {
    try {
        const { id: userID } = req.params;
        const { structure } = req.body;

        Structure.findOneAndUpdate({userID}, { structure }, { new: true })
            .then(updatedStructure => {
                if (!updatedStructure) {
                    return res.status(404).json({ message: "Guru structure not found" });
                }
                return res.status(200).json(updatedStructure);
            })
            .catch(error => res.status(500).json({ message: "Error updating structure", error: error.message }));
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export { getGuru, createGuru, updateGuru };