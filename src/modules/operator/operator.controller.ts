import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OperatorPolicy } from '../policy/operator/operator.policy';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Policy } from '../policy/policy.decorator';
import { PolicyGuard } from '../policy/operator/operator-policy.guard';

@Controller('operator')
@UseGuards(JwtAuthGuard,PolicyGuard)
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) { }

  @Post('')
  @Policy('operator','create')
  create(@Body() createOperatorDto: CreateOperatorDto) {
    return this.operatorService.create(createOperatorDto);
  }

  @Get('all')
  @Policy('operator','read')
  findAll() {
    console.log("Get all list of operator");
    // return this.operatorService.findAll();
  }

  @Get(':id')
  @Policy('operator','read')
  findOne(@Param('id') id: string) {
    return this.operatorService.findOne(+id);
  }

  @Patch(':id')
  @Policy('operator','update')
  update(@Param('id') id: string, @Body() updateOperatorDto: UpdateOperatorDto) {
    return this.operatorService.update(+id, updateOperatorDto);
  }

  @Delete(':id')
  @Policy('operator','delete')
  remove(@Param('id') id: string) {
    return this.operatorService.remove(+id);
  }
}
