const User = require("../../schemas/user");
const History = require("../../schemas/history");

module.exports = {
    type: "macro",
    async format (param) {
        if (param.toLowerCase() === "IP") return await User.countDocuments({
            type: {
                $eq: 0
            }
        });
        if (param === "전체") return await User.countDocuments();
        if (param === "활성") {
            let activeUsers = 0;

            const users = await User.find({
                type: {
                    $eq: 1
                }
            });

            const now = new Date();
            const startDate = now.setMonth(now.getMonth() - 1);

            for (const item of users) {
                const count = await History.countDocuments({
                    createdAt: {
                        $gte: startDate
                    },
                    user: {
                        $eq: item.uuid
                    }
                });

                if (count > 15) activeUsers++;
            };

            return activeUsers;
        }

        return await User.countDocuments({
            type: {
                $eq: 1
            }
        });
    }
}