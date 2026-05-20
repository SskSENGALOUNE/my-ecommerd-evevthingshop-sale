import { NotFoundException } from "@nestjs/common";
import { DeleteColorHandler } from "./delete-color.handler";
import { DeleteColorCommand } from "./delete-color.command";
import type { IColorRepository } from "../../../domain/color/color.repository";

describe("DeleteColorHandler", () => {
  let handler: DeleteColorHandler;
  let repo: jest.Mocked<IColorRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByColor: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    handler = new DeleteColorHandler(repo);
  });

  it("deletes color when it exists", async () => {
    const colorId = "uuid-1";
    repo.findById.mockResolvedValue({
      id: colorId,
      color: "RED",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.delete.mockResolvedValue(undefined);

    await handler.execute(new DeleteColorCommand(colorId));

    expect(repo.delete).toHaveBeenCalledWith(colorId);
  });

  it("throws NotFoundException when color does not exist", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteColorCommand("uuid-999")),
    ).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
